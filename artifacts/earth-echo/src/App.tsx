import { useEffect, useState } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { DatasetLoadError, loadTemperatureDataset } from '@/data/nasaDataService';
import type { EarthDataset } from '@/data/types';
import { LoadingState, LoadFailure, NotFoundPage, Shell } from '@/components/Site';
import { HomePage } from '@/pages/HomePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { ListenPage } from '@/pages/ListenPage';
import { MethodPage } from '@/pages/MethodPage';
import { SourcesPage } from '@/pages/SourcesPage';

function Routes({ dataset }: { dataset: EarthDataset }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage dataset={dataset} />} />
      <Route path="/explore" component={() => <ExplorePage dataset={dataset} />} />
      <Route path="/listen" component={() => <ListenPage dataset={dataset} />} />
      <Route path="/method" component={MethodPage} />
      <Route path="/sources" component={SourcesPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  const [loadState, setLoadState] = useState<{ loading: boolean; dataset?: EarthDataset; error?: string }>({ loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState({ loading: true });
    loadTemperatureDataset().then(({ dataset }) => {
      if (!cancelled) setLoadState({ loading: false, dataset });
    }).catch((error: unknown) => {
      if (!cancelled) {
        setLoadState({
          loading: false,
          error: error instanceof DatasetLoadError ? error.message : 'The data stream could not be validated.',
        });
      }
    });
    return () => { cancelled = true; };
  }, [attempt]);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {loadState.loading
        ? <Shell><LoadingState /></Shell>
        : loadState.dataset
          ? <Routes dataset={loadState.dataset} />
          : <Shell><LoadFailure message={loadState.error ?? 'No valid data available.'} retry={() => setAttempt((value) => value + 1)} /></Shell>}
    </WouterRouter>
  );
}

export default App;
