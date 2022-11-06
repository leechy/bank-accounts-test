import {
  DialogActions,
  DialogButton,
  DialogContent,
  DialogTitle,
  TextField,
} from "rmwc";
import { Dialog } from "@rmwc/dialog";

type AccountSettingsProps = {
  open: boolean;
  onSave: () => void;
  onClose: () => void;
};

const AccountSettings = ({ open, onSave, onClose }: AccountSettingsProps) => {
  console.log("Account Settings", open);
  return (
    <Dialog
      preventOutsideDismiss
      open={open}
      onClose={(evt: any) => {
        evt.detail.action === "accept" ? onSave() : onClose();
      }}
      onClosed={(evt: any) => console.log(evt.detail.action)}
    >
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <form>
          <TextField type="text" autoFocus />
          <TextField name="bank" type="text" />
          <TextField name="balance" type="number" />
        </form>
      </DialogContent>
      <DialogActions>
        <DialogButton action="close">Cancel</DialogButton>
        <DialogButton action="update">Update</DialogButton>
      </DialogActions>
    </Dialog>
  );
};

export default AccountSettings;
