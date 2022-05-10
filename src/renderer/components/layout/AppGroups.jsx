import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import styled from 'styled-components';
import { Button } from 'components/inputs';
import ShortcutCards from 'components/card/ShortcutCards.jsx';


const LoadingSpinner = styled.div`
  width: 100%;
  height: 100vh;
  transform: scale(3.0);
  filter: blur(0.015rem);
  transition: filter 0.6s;
`;

const Figure = styled.figure`
    vertical-align: bottom;
    margin-bottom: 6px;
    background-color: ${props => props.theme.accentColor};
`;

const SingleApp = ({ app }) => {
    return (
        <div key={'app_' + app.id}>
            <div className="my-2">
                <Figure className="avatar avatar-md" data-initial={app.name[0].toUpperCase()} />
                <em className="h3 mx-2">{app.name}</em>
                <Button small primary circle className="float-right" onClick={() => app.addCategory()}>
                    <i className="icon icon-plus"></i>
                </Button>
            </div>
            <ShortcutCards app={app} />
        </div>

    )
};

const AppGroups = observer(() => {
    let { apps, state } = useMst();

    let selectedApp = apps.selectedApp;

    if (false || state.isLoading) {
        return (<LoadingSpinner className="loading loading-lg"/>);
    }

    return (
        <React.Fragment>
            <div className="app-groups">
                { selectedApp
                    ? <SingleApp app={selectedApp} />
                    : apps.appList.map(app => <SingleApp app={app} />)
                }
            </div>
        </React.Fragment>
    );
});

export default AppGroups;
