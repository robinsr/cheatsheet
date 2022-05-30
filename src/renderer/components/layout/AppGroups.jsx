import Screen from 'components/cursor/Screen';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import styled from 'styled-components';
import { APP, HOME } from 'utils/paths';
import { Button } from 'components/inputs';
import ShortcutCards from 'components/card/ShortcutCards';


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

    if (state.isLoading) {
        return (<LoadingSpinner className="loading loading-lg"/>);
    }

    return (
        <React.Fragment>
            <div className="app-groups">
                {apps.appList.map(app => (
                    <Screen patterns={[ app.path + '*', HOME ]} key={app.path}>
                        <SingleApp app={app} />
                    </Screen>
                ))}
            </div>
        </React.Fragment>
    );
});

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

export default AppGroups;
