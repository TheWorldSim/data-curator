import {User_OwnerView} from "../../../../shared/models/user";

export interface State {
    newly_registered_user_email: string | undefined;
    user: User_OwnerView | undefined;
}
