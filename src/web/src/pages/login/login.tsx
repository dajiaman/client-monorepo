import BasicLayout from "../../layouts/basic";
import LoginForm from "../../components/LoginForm";
import "./login.less";

const Login = () => {
  return (
    <BasicLayout>
      <div className="login-page">
        <div className="left"></div>
        <div className="right">
          <div className="login-form-wrapper">
            <LoginForm />
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default Login;
