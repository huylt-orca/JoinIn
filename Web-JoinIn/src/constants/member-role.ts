export enum MemberRole {
  MEMBER, SUB_LEADER, LEADER
}

export function getMemberRoleValue(status: MemberRole): string {
  switch (status) {
    case MemberRole.MEMBER:
      return 'MEMBER';
    case MemberRole.SUB_LEADER:
      return 'SUB_LEADER';
    case MemberRole.LEADER:
      return 'LEADER';
    default:
      return '';
  }
}

export function getMemberRoleValueNumber(status: string): number {
  switch (status) {
    case 'MEMBER':
      return MemberRole.MEMBER;
    case 'SUB_LEADER':
      return MemberRole.SUB_LEADER;
    case 'LEADER':
      return MemberRole.LEADER;
    default:
      return MemberRole.MEMBER;
  }
}
