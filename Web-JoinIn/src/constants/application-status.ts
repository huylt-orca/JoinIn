export enum ApplicationStatus {
  WAITING, APPROVED, DISAPPROVED, INVITING
}

export function getApplicationStatusValue(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.WAITING:
      return 'WAITING';
    case ApplicationStatus.APPROVED:
      return 'APPROVED';
    case ApplicationStatus.DISAPPROVED:
      return 'DISAPPROVED';
    case ApplicationStatus.INVITING:
      return 'INVITING';
    default:
      return '';
  }
}
