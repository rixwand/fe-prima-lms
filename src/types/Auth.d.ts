interface BaseUser {
  username: string;
  fullName: string;
  email: string;
}

interface IRegister extends BaseUser {
  password: string;
}

type ILogin = Omit<IRegister, "username" | "fullName">;

interface IGetUser extends BaseUser {
  id: number;
  profilePict: string;
  roles: {
    name: string;
  };
}
