import { useRef } from 'react';
import { ControlledMenu, MenuItem, useHover, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/transitions/slide.css';
import styles from './NavbarOptions.module.css';
import { useDispatch } from 'react-redux';
import { uiActions } from '@/utils/store/ui-slice';

const NavbarOptions = ({ title, data }) => {
    const ref = useRef(null);
    const [menuState, toggle] = useMenuState({ transition: true });
    const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
    const dispatch = useDispatch();
    function handleMenuItemClick(option) {
        if (option.url === "/#customer-types") {
            dispatch(uiActions.setLandingPageSelectedTab({ value: option.id }))
        }
    }

    return (
        <div className={styles.productOptionsContainer}>
            <div ref={ref} {...anchorProps}>
                {title}
            </div>

            <ControlledMenu
                {...hoverProps}
                {...menuState}
                anchorRef={ref}
                onClose={() => toggle(false)}
                className={styles.menu}
                shift={-20}
            >
                {
                    data.map((group, index) => {
                        return (
                            <div key={group.id}>
                                {
                                    group.groupName && <h6 className={styles.h6}>{group.groupName}</h6>
                                }
                                {
                                    group.options.map((option, index) => {

                                        return (
                                            <MenuItem
                                                key={option.id}
                                                href={option.url}
                                                target={option.target ? option.target : "_self"}
                                                className={styles.menuItem} onClick={() => {
                                                    handleMenuItemClick(option);
                                                }}>
                                                {option.title}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </div>
                        )

                    })
                }
            </ControlledMenu>
        </div>
    );
}

export default NavbarOptions;