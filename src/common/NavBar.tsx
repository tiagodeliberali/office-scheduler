import { Link } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { AppUser, useAppContext } from './AppContext';

import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { CommandBarButton, IComponentAsProps } from '@fluentui/react';

import { IButtonProps } from '@fluentui/react/lib/Button';
import { setVirtualParent } from '@fluentui/dom-utilities';

import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons(/* optional base url */);

interface UserAvatarProps {
    user: AppUser
};

const CustomButton: React.FunctionComponent<IComponentAsProps<ICommandBarItemProps>> = props => {
    const WrappedButton = () => (
        <CommandBarButton {...(props as any)} text={'custom ' + (props.text || props.name)} />
    );
    return <Link to={props.href!} ><WrappedButton /></Link>;
};

function UserAvatar(props: UserAvatarProps) {
    // If a user avatar is available, return an img tag with the pic
    return <img
        src={props.user.avatar || '/images/no-profile-photo.png'} alt="user"
        className="rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}></img>;
}

export default function NavBar() {
    const app = useAppContext();
    const user = app.user || { displayName: '', email: '' };

    const _items: ICommandBarItemProps[] = [
        {
            key: 'home',
            text: 'Home',
            cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
            iconProps: { iconName: 'Add' },
            commandBarButtonAs: CustomButton,
            href: '/'
        },
        {
            key: 'calendar',
            text: 'Calendar',
            iconProps: { iconName: 'Upload' },
            commandBarButtonAs: CustomButton,
            href: '/calendar'
        },
    ];

    const _farItems: ICommandBarItemProps[] = [
        {
            key: 'user',
            text: user.displayName,
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Grid view',
            iconOnly: true,
            iconProps: { iconName: 'Tiles' },
            onClick: () => console.log('Tiles'),
        },
        {
            key: 'info',
            text: 'Signin',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: () => app.signIn!,
        },
    ];


    return (
        //     <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
        //   <RouterNavLink to="/calendar" className="nav-link" exact>Calendar</RouterNavLink>

        //   <AuthenticatedTemplate>
        //                 <NavDropdown title={<UserAvatar user={user} />} id="user-dropdown" align="end">
        //                   <h5 className="dropdown-item-text mb-0"></h5>
        //                   <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
        //                   <Dropdown.Divider />
        //                   <Dropdown.Item onClick={app.signOut!}>Sign Out</Dropdown.Item>
        //                 </NavDropdown>
        //               </AuthenticatedTemplate>
        //               <UnauthenticatedTemplate>
        //                 <NavItem>
        //                   <Nav.Link
        //                     onClick={}>Sign In</Nav.Link>
        //                 </NavItem>
        //               </UnauthenticatedTemplate>
        <CommandBar
            items={_items}
            farItems={_farItems}
            ariaLabel="Inbox actions"
            primaryGroupAriaLabel="Email actions"
            farItemsGroupAriaLabel="More actions"
        />
    );
}