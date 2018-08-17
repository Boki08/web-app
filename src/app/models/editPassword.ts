export class EditPassword{
    constructor(
        public OldPassword: string,
        public NewPassword: string,
        public ConfirmPassword: string
    ){ }
}