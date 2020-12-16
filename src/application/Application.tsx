import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { getApplicationPeriod } from '../common/api';
import { ApplicationPeriod } from '../common/types';
import ApplicationPage from './ApplicationPage';
import Page1 from './page1/Page1';

type ParamTypes = {
  id: string;
};

const Application = (): JSX.Element | null => {
  const match = useRouteMatch();
  const { id } = useParams<ParamTypes>();
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  const [applicationPeriod, setApplicationPeriod] = useState<ApplicationPeriod>(
    {} as ApplicationPeriod
  );

  useEffect(() => {
    async function fetchData() {
      const unit = await getApplicationPeriod({ id });
      setApplicationPeriod(unit);
      setReady(true);
    }
    fetchData();
  }, [id]);

  return ready ? (
    <>
      <Switch>
        <Route exact path={`${match.url}/page1`}>
          <ApplicationPage
            heading="1. Vakiovuoron luominen"
            text={applicationPeriod.name}
            match={match}>
            <Page1 applicationPeriod={applicationPeriod} />
          </ApplicationPage>
        </Route>
        <Route exact path={`${match.url}/page2`}>
          <ApplicationPage
            heading={t('2. Vakiovuoron ajankohta')}
            text={applicationPeriod.name}
            match={match}
          />
        </Route>
        <Route exact path={`${match.url}/page3`}>
          <ApplicationPage
            heading="3. Varaajan perustiedot"
            text={applicationPeriod.name}
            match={match}
          />
        </Route>
        <Route exact path={`${match.url}/page4`}>
          <ApplicationPage
            heading="4. Lähetä käsiteltäväksi"
            text={applicationPeriod.name}
            match={match}
          />
        </Route>
      </Switch>
    </>
  ) : null;
};

export default Application;