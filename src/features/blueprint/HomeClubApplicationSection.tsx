import { DataPanel, ListRow } from '@/components/shared/data-display';
import { EmptyState, SourceBadge } from '@/components/shared/feedback';
import { FieldGroup, SelectField, TextareaField } from '@/components/shared/forms';
import { ActionButton, PanelHead, SectionIntro } from '@/components/shared/layout';

import { formatDateTime, getFallbackPlayer, playerOptions } from './application-data';
import { useHomeClubApplication } from './use-home-club-application';

export function HomeClubApplicationSection() {
  const { state, setState, isLoading, myApplications, changeOperator, handleSubmit, handleWithdraw, getSelectedClubName } =
    useHomeClubApplication();

  if (isLoading || !state) {
    return (
      <section className="section">
        <SectionIntro
          eyebrow="Club Application"
          title="Home Club Application Workbench"
          description="Loading joinable clubs, player context, and recent application snapshots."
        />
      </section>
    );
  }

  const fallbackPlayer = getFallbackPlayer(state.operatorId);
  const selectedPlayerName = state.playerContext.player?.displayName ?? fallbackPlayer.nickname;
  const application = state.application.application;
  const source = state.application.source ?? state.playerContext.source ?? state.clubs.source;
  const warning = state.application.warning ?? state.playerContext.warning ?? state.clubs.warning;

  return (
    <section className="section">
      <SectionIntro
        eyebrow="Club Application"
        title="Home Club Application Workbench"
        description="This is the most business-like interaction block on the blueprint homepage. It ties together joinable clubs, current player identity, application submission, and withdrawal while keeping the API-first plus mock-fallback behavior visible."
      />

      <article className="card public-join-card">
        <PanelHead
          title="Registered Player Club Application"
          description={
            <>
              The form calls <code>POST /clubs/:clubId/applications</code> first. If the backend is unavailable, it falls
              back to mock handling and mirrors the result into the local inbox bridge so the member hub flow stays connected.
            </>
          }
          aside={<SourceBadge source={source} warning={warning} />}
        />
        <div className="public-join-card__callout">
          <strong>Current migration state</strong>
          <span>
            This block is already running as a React feature component, which makes it a good place to continue extracting
            feature hooks, shared cards, and form-oriented building blocks.
          </span>
        </div>
        <FieldGroup className="guest-flow__form">
          <SelectField label="Applicant" value={state.operatorId} onChange={(event) => void changeOperator(event.currentTarget.value)}>
              {playerOptions.map((player) => (
                <option key={player.operatorId} value={player.operatorId}>
                  {player.nickname}
                </option>
              ))}
          </SelectField>
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
        </div>
        {application ? (
          <div className="guest-flow__result">
            <strong>
              {selectedPlayerName} {'->'} {getSelectedClubName(application.clubId, state.clubs.items)}
            </strong>
            <span>Status: {application.status}</span>
            <span>Application id: {application.id}</span>
            <span>Submitted at: {formatDateTime(application.createdAt)}</span>
            <span>Note: {application.message}</span>
          </div>
        ) : (
          <div className="guest-flow__result guest-flow__result--muted">
            <span>Current applicant: {selectedPlayerName}</span>
            <span>{fallbackPlayer.note}</span>
            <span>The result will also be mirrored into the local inbox bridge so the member hub flow can continue.</span>
          </div>
        )}
      </article>

      <DataPanel
        title="Recent application snapshot"
        description="This list shows the current operator's recent application history from the local inbox bridge, which keeps both mock and API-driven flows visible during migration."
      >
        <ul className="list">
          {myApplications.length > 0 ? (
            myApplications.map((item) => (
              <ListRow
                key={item.id}
                main={
                  <>
                  <strong>{item.clubName}</strong>
                  <span>{item.message}</span>
                  </>
                }
                aside={
                  <>
                  <span>{item.status}</span>
                  <span>{formatDateTime(item.submittedAt)}</span>
                  </>
                }
              />
            ))
          ) : (
            <EmptyState asListItem>No application records are available yet for the current operator.</EmptyState>
          )}
        </ul>
      </DataPanel>
    </section>
  );
}
