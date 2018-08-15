import { RouteComponentProps, withRouter } from 'react-router';

export interface RouterProviderProps {
  children: (router: RouteComponentProps<{}>) => JSX.Element;
}

export const RouterProvider = withRouter<RouterProviderProps & RouteComponentProps<{}>>(props => {
  const { children, ...router } = props;
    return children(router);
})
