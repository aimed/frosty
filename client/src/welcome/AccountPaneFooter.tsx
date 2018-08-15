import * as React from 'react';

import { Link } from 'react-router-dom';

export function AccountPaneFooter() {
  return (
    <div className="WelcomePage__Footer">
      <Link to="/signup">No account?</Link>
      <span>|</span>
      <Link to="/signin">Sign in?</Link>
      <span>|</span>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
}