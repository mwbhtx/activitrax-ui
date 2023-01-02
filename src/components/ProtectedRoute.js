import { withAuthenticationRequired } from "@auth0/auth0-react";

export const ProtectedRoute = ({ component, ...propsForComponent}) => {
    const Cp = withAuthenticationRequired(component);
    return <Cp {...propsForComponent} />
  }