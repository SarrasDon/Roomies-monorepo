import { SnackbarMessage } from '../enums/snackbar-message.enum';

export interface SnackbarConfig {
  message: string;
  type: SnackbarMessage;
}
