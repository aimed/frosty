import './Layout.scss';

import * as React from 'react';

import { Link } from 'react-router-dom';

export interface LayoutState {}
export interface LayoutProps {}

export class Layout extends React.Component<LayoutProps, LayoutState> {
  public render() {
    return (
      <div className="Layout">
        <div className="Layout__Content">{this.props.children}</div>
        <div className="Layout__Footer">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <a href="https://github.com/aimed/frosty" target="__blank">Github</a>
        </div>
      </div>
    );
  }
}
