export interface ClubRankNodeRequest {
  code: string;
  label: string;
  minimumContribution: number;
  privileges?: string[];
}
