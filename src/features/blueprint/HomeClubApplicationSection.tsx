import { DataPanel } from '@/components/shared/data-display';
import { ClubApplicationList, WorkbenchGuidePanel, WorkbenchResultSummary } from '@/components/shared/domain';
import { FieldGroup, SelectField, TextInputField, TextareaField } from '@/components/shared/forms';
import { ActionButton, SectionIntro } from '@/components/shared/layout';
import { Card, CardContent, Skeleton, StatusPill } from '@/components/ui';

import { formatDateTime, getFallbackPlayerName } from './application-data';
import { useHomeClubApplication } from './use-home-club-application';

export function HomeClubApplicationSection() {
  const {
    state,
    setState,
    isLoading,
    isRefreshing,
    myApplications,
    handleSubmit,
    handleWithdraw,
    refreshCurrentApplication,
    getSelectedClubName,
  } = useHomeClubApplication();

  if (isLoading || !state) {
    return (
      <section className="section">
        <SectionIntro
          eyebrow="Club Application"
          title="Home Club Application Workbench"
          description="Loading joinable clubs, player context, and recent application snapshots."
        />
        <Card className="public-join-card">
          <CardContent className="public-join-card__loading">
            <Skeleton className="blueprint-loading-skeleton blueprint-loading-skeleton--title" />
            <Skeleton className="blueprint-loading-skeleton" />
            <Skeleton className="blueprint-loading-skeleton" />
            <Skeleton className="blueprint-loading-skeleton blueprint-loading-skeleton--short" />
          </CardContent>
        </Card>
      </section>
    );
  }

  const selectedPlayerName = state.playerContext.player?.displayName ?? getFallbackPlayerName(state);
  const application = state.application.application;
  const source = state.application.source ?? state.playerContext.source ?? state.clubs.source;
  const warning = state.application.warning ?? state.playerContext.warning ?? state.clubs.warning;
  const applicationTone =
    application?.status === 'Approved'
      ? 'success'
      : application?.status === 'Rejected' || application?.status === 'Withdrawn'
        ? 'danger'
        : 'warning';

  return (
    <section className="section">
      <SectionIntro
        eyebrow="Club Application"
        title="Home Club Application Workbench"
        description="This flow is now bound to the current registered user. Guests can browse the public hall, but only registered users can submit or withdraw club applications."
      />

      <WorkbenchGuidePanel
        className="public-join-card"
        title="Registered Player Club Application"
        description={
          <>
            The form calls <code>POST /clubs/:clubId/applications</code> first. If the backend is unavailable, it falls
            back to mock handling and mirrors the result into the local inbox bridge so the member hub flow stays connected.
          </>
        }
        source={source}
        warning={warning}
        noteTitle="Current migration state"
        noteBody={
          <span>
            The operator is derived from the active login session rather than a page-local selector, which keeps the
            application flow aligned with real user identity.
          </span>
        }
      >
        <FieldGroup className="guest-flow__form">
          <TextInputField label="Current applicant" value={selectedPlayerName} readOnly />
          <TextInputField label="Current operatorId" value={state.operatorId} readOnly />
          <SelectField
            label="Target club"
            value={state.clubId}
            onChange={(event) =>
              setState((current) => (current ? { ...current, clubId: event.currentTarget.value } : current))
            }
          >
            {state.clubs.items.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </SelectField>
          <TextareaField
            label="Application note"
            rows={4}
            value={state.message}
            onChange={(event) =>
              setState((current) => (current ? { ...current, message: event.currentTarget.value } : current))
            }
          />
        </FieldGroup>
        <div className="public-join-card__actions">
          <ActionButton onClick={() => void handleSubmit()}>Submit club application</ActionButton>
          <ActionButton disabled={!application || application.status !== 'Pending'} onClick={() => void handleWithdraw()}>
            Withdraw current application
          </ActionButton>
          <ActionButton onClick={() => void refreshCurrentApplication()}>
            {isRefreshing ? 'Refreshing...' : 'Refresh current status'}
          </ActionButton>
        </div>
        {application ? (
          <WorkbenchResultSummary
            headline={
              <>
                {selectedPlayerName} {'->'} {getSelectedClubName(application.clubId, state.clubs.items)}
              </>
            }
            items={[
              { label: 'Status', value: <StatusPill tone={applicationTone}>{application.status}</StatusPill> },
              { label: 'Application id', value: application.id },
              { label: 'Submitted at', value: formatDateTime(application.createdAt) },
              { label: 'Note', value: application.message },
            ]}
          />
        ) : (
          <WorkbenchResultSummary
            muted
            items={[
              { label: 'Current applicant', value: selectedPlayerName },
              { label: 'Current operatorId', value: state.operatorId },
              {
                label: 'Bridge behavior',
                value: 'The result will also be mirrored into the local inbox bridge so the member hub flow can continue.',
              },
            ]}
          />
        )}
      </WorkbenchGuidePanel>

      <DataPanel
        title="Recent application snapshot"
        description="This list shows the current operator's recent application history from the local inbox bridge, which keeps both mock and API-driven flows visible during migration."
      >
        <ClubApplicationList
          items={myApplications.map((item) => ({
            id: item.id,
            title: item.clubName,
            message: item.message,
            submittedAt: formatDateTime(item.submittedAt),
            status: item.status,
          }))}
          emptyText="No application records are available yet for the current operator."
        />
      </DataPanel>
    </section>
  );
}
