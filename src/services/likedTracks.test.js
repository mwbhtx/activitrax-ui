import { likeTrack, unlikeTrack, getLikedTrackIds, getSpotifyTrackId } from './likedTracks';

jest.mock('axios', () => {
    const mockAxios = jest.fn();
    return { __esModule: true, default: mockAxios };
});

import axios from 'axios';

const TOKEN = 'test-token';

beforeEach(() => jest.clearAllMocks());

describe('getSpotifyTrackId', () => {
    test('extracts track ID from a standard Spotify URL', () => {
        expect(getSpotifyTrackId({ spotify_url: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC' }))
            .toBe('4uLU6hMCjMI75M1A2tKUQC');
    });

    test('strips query params from URL', () => {
        expect(getSpotifyTrackId({ spotify_url: 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=abc123' }))
            .toBe('4uLU6hMCjMI75M1A2tKUQC');
    });

    test('returns null when spotify_url is missing', () => {
        expect(getSpotifyTrackId({ name: 'No URL' })).toBeNull();
        expect(getSpotifyTrackId(null)).toBeNull();
    });
});

describe('likeTrack', () => {
    test('sends POST with correct track payload', async () => {
        axios.mockResolvedValue({ data: { success: true } });

        const track = {
            name: 'Test Song',
            artist: 'Test Artist',
            album: 'Test Album',
            album_image: 'image.jpg',
            spotify_url: 'https://open.spotify.com/track/abc123',
            preview_url: null,
            duration: 200000,
        };

        await likeTrack(TOKEN, track);

        expect(axios).toHaveBeenCalledWith(expect.objectContaining({
            method: 'POST',
            data: expect.objectContaining({
                track: expect.objectContaining({
                    spotify_track_id: 'abc123',
                    spotify_uri: 'spotify:track:abc123',
                    name: 'Test Song',
                    artist: 'Test Artist',
                }),
            }),
        }));
    });
});

describe('unlikeTrack', () => {
    test('sends DELETE to the correct URL', async () => {
        axios.mockResolvedValue({ data: { success: true } });

        await unlikeTrack(TOKEN, 'abc123');

        expect(axios).toHaveBeenCalledWith(expect.objectContaining({
            method: 'DELETE',
            url: expect.stringContaining('/user/liked-tracks/abc123'),
        }));
    });
});

describe('getLikedTrackIds', () => {
    test('returns array of track IDs from response', async () => {
        axios.mockResolvedValue({ data: { liked_track_ids: ['id1', 'id2'] } });

        const result = await getLikedTrackIds(TOKEN);

        expect(result).toEqual(['id1', 'id2']);
    });
});
