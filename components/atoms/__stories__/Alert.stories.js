import { SuccessAlert, ErrorAlert, WarningAlert, InfoAlert } from "../Alert";

export const SuccessAlertSample = (args) => <SuccessAlert{ ...args } />;
SuccessAlertSample.args = {
  label: 'Success!',
};

export const ErrorAlertSample = (args) => <ErrorAlert{ ...args } />;
ErrorAlertSample.args = {
  label: 'Error!',
};

export const WarningAlertSample = (args) => <WarningAlert{ ...args } />;
WarningAlertSample.args = {
  label: 'Warning!',
};

export const InfoAlertSample = (args) => <InfoAlert{ ...args } />;
InfoAlertSample.args = {
  label: 'Info!'
};

export default {
  title: 'Alert',
};
