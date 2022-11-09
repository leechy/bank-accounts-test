import { Link } from "react-router-dom";
import {
  Card,
  CardActionButton,
  CardActionButtons,
  CardActions,
  CardPrimaryAction,
  Typography,
} from "rmwc";

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
  const balanceString = balance.toLocaleString("en-GB", {
    style: "currency",
    currency,
  });

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
            {balanceString}
          </Typography>
        </div>
      </CardPrimaryAction>
      <CardActions theme="onSecondary">
        <CardActionButtons>
          <CardActionButton>Top Up</CardActionButton>
          <CardActionButton>Send Off</CardActionButton>
        </CardActionButtons>
      </CardActions>
    </Card>
  );
};

export default AccountCard;
