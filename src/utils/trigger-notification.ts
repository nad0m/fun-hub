import { notifications } from '@mantine/notifications';

type NotificationType = 'Success' | 'Warning' | 'Error';

const ColorMap: Record<NotificationType, string> = {
  Success: 'green',
  Warning: 'yellow',
  Error: 'red',
};

export const triggerNotification = (type: NotificationType, message: string) => {
  notifications.show({
    autoClose: 4000,
    title: type,
    message,
    color: ColorMap[type],
  });
};
