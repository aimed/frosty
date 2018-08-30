import './Notification.scss';

import * as React from 'react';

import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

import { classnames } from '@hydrokit/utils';
import posed from 'react-pose';

export type NotificationType = 'error' | 'success';

const iconForType = {
  'error': FaExclamationTriangle,
  'success': FaCheckCircle,
};

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
  const Icon = iconForType[props.type];
  
  return props.children ? (
    <div className={className}>
      <div className="notification__icon"><Icon /></div>
      <div className="notification__message">
        {props.children}
      </div>
    </div>
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
