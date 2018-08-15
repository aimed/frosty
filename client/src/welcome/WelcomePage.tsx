import './WelcomePage.scss';

import * as React from 'react';

import { Route, Switch } from 'react-router';

import { FridgeLocalWithData } from '../fridge/FridgeLocal';
import { AccountPaneFooter } from './AccountPaneFooter';
import { ForgotPasswordFormWithData } from './ForgotPasswordForm';
import { ResetPasswordFormWithData } from './ResetPasswordForm';
import { SignInFormWithData } from './SignInForm';
import { SignupFormWithData } from './SignUpForm';

/*
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                                                                              │
│                                                                              │
│                                                                              │
│                                    Frosty                                    │
│                              What' in my fridge?                             │
│                                                                              │
│                                 ┌─────────┐                                  │
│                                 │Email    │                                  │
│                                 ├─────────┤                                  │
│                                 │Password │                                  │
│                                 └─────────┘                                  │
│                                 ┌─────────┐                                  │
│                                 │ Sign In │                                  │
│                                 └─────────┘                                  │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
*/






interface WelcomePageProps { }

export class WelcomePage extends React.PureComponent<WelcomePageProps, {}> {
  public render() {
    return (
      <div className="WelcomePage">
        <div className="WelcomePage__AccountPane">
          <Switch>
            <Route path="/signin">
              <>
                <h1>Sign in</h1>
                <SignInFormWithData />
              </>
            </Route>
            <Route path="/signup">
              <>
                <h1>Sign up</h1>
                <SignupFormWithData />
              </>
            </Route>
            <Route path="/forgot-password">
              <>
                <h1>Request password reset link</h1>
                <ForgotPasswordFormWithData />
              </>
            </Route>
            <Route path="/reset-password">
              <>
                <h1>Reset password</h1>
                <ResetPasswordFormWithData />
              </>
            </Route>
          </Switch>
          <AccountPaneFooter />
        </div>
        <div className="WelcomePage__Fridge">
          <FridgeLocalWithData />
        </div>
      </div>
    );
  }
}

export const WelcomePageWithData = WelcomePage;

// function FridgePicture() {
//   return (
//     <picture>
//           <img
//             sizes="(max-width: 1400px) 80vw, 1400px"
//             srcSet="
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_200.png 200w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_775.png 775w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1136.png 1136w,
//               fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1400.png 1400w"
//             src="fridge/fridge_qq88zm_c_scale_w_1400_sbtf4d_c_scale,w_1400.png"
//             alt="Fridge" />
//         </picture>
//   );
// }
