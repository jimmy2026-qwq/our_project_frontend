import { useState } from 'react';

import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

export function useClubDetailDialogs() {
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLineupDialogOpen, setIsLineupDialogOpen] = useState(false);
  const [selectedLineupTournament, setSelectedLineupTournament] = useState<
    ClubPublicProfile['activeTournaments'][number] | null
  >(null);
  const [isContributionDialogOpen, setIsContributionDialogOpen] =
    useState(false);
  const [selectedContributionMember, setSelectedContributionMember] =
    useState<ClubAdminMemberEntry | null>(null);
  const [isContributionSubmitting, setIsContributionSubmitting] =
    useState(false);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [selectedTitleMember, setSelectedTitleMember] =
    useState<ClubAdminMemberEntry | null>(null);
  const [isTitleSubmitting, setIsTitleSubmitting] = useState(false);
  const [isContributionTitleDialogOpen, setIsContributionTitleDialogOpen] =
    useState(false);
  const [isContributionTitleSubmitting, setIsContributionTitleSubmitting] =
    useState(false);

  return {
    isApplicationDialogOpen,
    setIsApplicationDialogOpen,
    isLineupDialogOpen,
    setIsLineupDialogOpen,
    selectedLineupTournament,
    setSelectedLineupTournament,
    isContributionDialogOpen,
    setIsContributionDialogOpen,
    selectedContributionMember,
    setSelectedContributionMember,
    isContributionSubmitting,
    setIsContributionSubmitting,
    isTitleDialogOpen,
    setIsTitleDialogOpen,
    selectedTitleMember,
    setSelectedTitleMember,
    isTitleSubmitting,
    setIsTitleSubmitting,
    isContributionTitleDialogOpen,
    setIsContributionTitleDialogOpen,
    isContributionTitleSubmitting,
    setIsContributionTitleSubmitting,
  };
}
