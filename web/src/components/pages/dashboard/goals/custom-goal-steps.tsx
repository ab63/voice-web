import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { CustomGoal, CustomGoalParams } from 'common/goals';
import { UserClient } from 'common/user-clients';
import URLS from '../../../../urls';
import { getManageSubscriptionURL } from '../../../../utility';
import StateTree from '../../../../stores/tree';
import { LocaleLink } from '../../../locale-helpers';
import ShareModal from '../../../share-modal/share-modal';
import {
  ArrowLeft,
  CheckIcon,
  CrossIcon,
  PenIcon,
  SettingsIcon,
  ShareIcon,
} from '../../../ui/icons';
import { Button, LinkButton } from '../../../ui/ui';
import { CircleProgress, Fraction } from '../ui';

const Buttons = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className="buttons padded" {...props}>
    {children}
    <div className="filler" />
  </div>
);

const ArrowButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button className="arrow-button" type="button" {...props}>
    <ArrowLeft />
  </button>
);

const CloseButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button type="button" className="close-button" {...props}>
    <CrossIcon />
  </button>
);

export const ViewGoal = ({
  onNext,
  customGoal: { amount, current, days_interval },
}: {
  onNext: () => any;
  customGoal: CustomGoal;
}) => (
  <div className="padded view-goal">
    <div className="top">
      <h2>Custom Goals</h2>
      <button className="edit-button" type="button" onClick={onNext}>
        <PenIcon />
      </button>
    </div>
    {Object.keys(current).map(key => {
      const value = (current as any)[key];
      return (
        <div key={key} className={'goal-box ' + key}>
          <Fraction numerator={value} denominator={amount} />

          <div className="relative">
            <CircleProgress value={value / amount} />
            <div className="interval">
              {days_interval == 7 ? 'Of weekly goal' : 'Of daily goal'}
            </div>
          </div>

          <LinkButton
            className="cta"
            rounded
            absolute
            to={'/en' + (key == 'speak' ? URLS.SPEAK : URLS.LISTEN)}>
            {key[0].toUpperCase() + key.slice(1)}
          </LinkButton>
        </div>
      );
    })}
  </div>
);

interface CustomGoalStepProps {
  closeButtonProps: React.HTMLProps<HTMLButtonElement>;
  completedFields: React.ReactNode;
  currentFields: React.ReactNode;
  nextButtonProps: React.HTMLProps<HTMLButtonElement>;
  state: CustomGoalParams;
}

interface AccountProps {
  account: UserClient;
}

const SubmitStep = ({
  account,
  closeButtonProps,
  completedFields,
  currentFields,
  nextButtonProps,
}: CustomGoalStepProps & AccountProps) => (
  <div className="padded">
    {completedFields}
    {account.basket_token ? (
      <a
        className="manage-subscriptions"
        href={getManageSubscriptionURL(account)}
        target="__blank"
        rel="noopener noreferrer">
        <Localized id="manage-subscriptions">
          <span />
        </Localized>
        <SettingsIcon />
      </a>
    ) : (
      <>
        <label className="box">
          {currentFields}
          <div className="content">
            I’d like updates and goal reminders to keep current with Common
            Voice
          </div>
        </label>
        <Localized
          id="email-opt-in-privacy"
          privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
          <p />
        </Localized>
        <Localized id="read-terms-q">
          <LocaleLink to={URLS.TERMS} className="terms" blank />
        </Localized>
      </>
    )}
    <Buttons>
      <CloseButton {...closeButtonProps} />
      <Button rounded className="submit" {...nextButtonProps}>
        <CheckIcon /> Confirm Goal
      </Button>
    </Buttons>
  </div>
);

export default [
  ({ nextButtonProps }) => (
    <>
      <div className="padded">
        <h1>Build a custom goal</h1>
        <span className="sub-head">
          Help reach 10,000 hours in English with a personal goal
        </span>
      </div>

      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
      </div>

      <Button className="get-started-button" rounded {...nextButtonProps}>
        Set a goal
      </Button>
    </>
  ),

  ({ closeButtonProps, currentFields, nextButtonProps }) => (
    <>
      <div className="padded">
        <h2>What kind of goal do you want to build?</h2>
        {currentFields}
      </div>
      <Buttons style={{ marginBottom: 20 }}>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
        <div className="text">
          <h4>Can't decide?</h4>
          <p>
            10,000 hours is achievable in just over 6 months if 1000 people
            record 45 clips a day.
          </p>
        </div>
      </div>
    </>
  ),

  ({
    closeButtonProps,
    completedFields,
    currentFields,
    nextButtonProps,
    state,
  }) => (
    <>
      <div className="padded">
        {completedFields}
        <h2>
          Great! How many clips
          {state.daysInterval == 7 ? ' a week' : ' per day'}?
        </h2>
        {currentFields}
      </div>
      <Buttons>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
    </>
  ),

  ({ closeButtonProps, completedFields, currentFields, nextButtonProps }) => (
    <>
      <div className="padded">
        {completedFields}
        <h2>Do you want to Speak, Listen or both?</h2>
        {currentFields}
      </div>
      <Buttons>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
    </>
  ),

  connect<AccountProps>(({ user }: StateTree) => ({ account: user.account }))(
    SubmitStep
  ),

  ({ nextButtonProps, state }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    return (
      <div className="padded">
        {showShareModal && (
          <ShareModal
            title={
              <>
                <b>Help us</b> Find more voices, share your goal
              </>
            }
            text={`Share your ${state.amount} Clip ${
              state.daysInterval == 7 ? 'Weekly' : 'Daily'
            } Goal for ${
              ({
                speak: 'Speaking',
                listen: 'Listening',
                both: 'Speaking and Listening',
              } as any)[state.type]
            }`}
            onRequestClose={() => setShowShareModal(false)}
          />
        )}
        <div className="check">
          <div className="shadow" />
          <CheckIcon />
        </div>
        <h2>Your weekly goal has been created</h2>
        <p>
          Track progress here and on your stats page.
          <br />
          Return here to edit your goal anytime.
        </p>
        <Button
          rounded
          className="share-button"
          onClick={() => setShowShareModal(true)}>
          <ShareIcon /> Share my goal
        </Button>
        <CloseButton {...nextButtonProps} />
      </div>
    );
  },
] as (React.ComponentType<CustomGoalStepProps>)[];