import './Notification.scss';

import * as React from 'react';

import { classnames } from '@hydrokit/utils';
import posed from 'react-pose';

export type NotificationType = 'error' | 'success';

export interface NotificationProps {
  type: NotificationType;
  className?: string;
}

export const Notification: React.StatelessComponent<NotificationProps> = props => {
  const className = classnames(
    'notification',
    'notification--' + props.type,
    props.className
  );
  
  return props.children ? (
    <div className={className}>{props.children}</div>
  ) : null;
};


const Content = posed.div({
  hidden: { scale: 0 },
  visible: { scale: 1 },
});

export const NotificationPosed: React.StatelessComponent<NotificationProps> = props => {
  return (
    <Content pose={props.children ? 'visible' : 'hidden'}>
      { props.children && <Notification {...props} /> }
    </Content>
  );
}
