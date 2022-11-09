import { Link } from "react-router-dom";
import {
  Card,
  CardActionButton,
  CardActionButtons,
  CardActions,
  CardPrimaryAction,
  Typography,
} from "rmwc";
import { balanceString } from "../utils/format";

type AccountCardProps = {
  id: string;
  bank?: string;
  account?: string;
  balance?: number;
  currency: string;
};

const AccountCard = ({
  id,
  bank,
  account,
  balance = 0,
  currency,
}: AccountCardProps) => {
  return (
    <Card className="accounts--card">
      <CardPrimaryAction tag={Link} to={`/accounts/${id}`}>
        <div className="accounts--card-primary-action">
          <Typography
            use="subtitle2"
            tag="h3"
            theme="textSecondaryOnBackground"
          >
            {bank || "Unknown Bank"}
          </Typography>
          <Typography use="headline6" tag="h2">
            {account || "Untitled Account"}
          </Typography>
          <Typography use="headline4" tag="h1" theme="textPrimaryOnBackground">
            {balanceString(balance, currency)}
          </Typography>
        </div>
      </CardPrimaryAction>
      <CardActions theme="onSecondary">
        <CardActionButtons>
          <CardActionButton tag={Link} to={`/transactions/to/${id}`}>
            Top Up
          </CardActionButton>
          <CardActionButton tag={Link} to={`/transactions/from/${id}`}>
            Send Off
          </CardActionButton>
        </CardActionButtons>
      </CardActions>
    </Card>
  );
};

export default AccountCard;
