import { Link } from "react-router-dom";
import {
  Button,
  TopAppBar,
  TopAppBarNavigationIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "rmwc";

type AppBarProps = {
  title?: string;
  back?: string;
  action?: string;
  actionIcon?: string;
  onAction?: () => void;
};

const AppBar = (props: AppBarProps) => (
  <TopAppBar fixed className="mdc-elevation--z7">
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        {props.back && (
          <TopAppBarNavigationIcon
            icon="arrow_back"
            tag={Link}
            to={props.back}
          />
        )}
        {props.title && <TopAppBarTitle>{props.title}</TopAppBarTitle>}
      </TopAppBarSection>
      {props.action && (
        <TopAppBarSection alignEnd>
          <Button
            icon={props.actionIcon || null}
            label={props.action}
            dense
            theme="textSecondaryOnDark"
            onClick={props.onAction}
          />
        </TopAppBarSection>
      )}
    </TopAppBarRow>
  </TopAppBar>
);

export default AppBar;
