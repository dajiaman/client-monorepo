import { FC, useEffect, useState } from "react";
import AuthService from "../../api/auth";
import { createSelectors } from "../../stores";
import useUserStore from "../../stores/user";
import cacheStorage from "../../utils/storage";
import { Button, Checkbox, Form, Input, Message } from "@arco-design/web-react";
import { isEmptyObject } from "lib/common/type";
import { useNavigate } from "react-router";
import "./loginForm.less";
import { useBoolean, useLocalStorageState, useUpdateEffect } from "ahooks";
import { getUrlFromEnvConfig } from "../../utils/env";
import useUpdateStore from "../../stores/update";
import { useSearchParams } from "react-router-dom";
import { removeLoginToken } from "../../utils/auth";

type FieldType = {
  username?: string;
  agreement?: boolean;
  remember?: string;
};

interface StateProps {}

const LoginForm: FC<StateProps> = () => {
  const navigate = useNavigate();
  // 是否可以自动登录
  const [autoLoginEnable, setAutoLoginEnable] = useLocalStorageState(
    "autoLoginEnable",
    {
      defaultValue: false,
    }
  );

  const [autoLogin, setAutoLogin] = useState(false);
  let [searchParams, _] = useSearchParams();

  const [agreement] = useBoolean(cacheStorage.getItem("agreement", false));
  const [remember] = useBoolean(cacheStorage.getItem("remember", false));

  const checkUpdate = createSelectors(useUpdateStore).use.checkUpdate();
  const setUpdateInfo = createSelectors(useUpdateStore).use.setUpdateInfo();

  useEffect(() => {
    removeLoginToken();
    if (searchParams.get("from") === "logout") {
      setAutoLogin(false);
      return;
    }

    if (!remember || !username || !agreement) {
      setAutoLoginEnable(false);
      setAutoLogin(false);
      return;
    }

    // 检查更新
    // checkUpdate()
    //   .then((updateInfo) => {
    //     const hasUpdate = !isEmpty(updateInfo);
    //     if (hasUpdate) {
    //       setAutoLogin(false);
    //       return;
    //     } else {
    //       setAutoLogin(true);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(`check update error:`, err);
    //   });
  }, []);

  useUpdateEffect(() => {
    console.log(`autoLogin:`, autoLogin);
    console.log(`autoLoginEnable:`, autoLoginEnable);
    if (autoLoginEnable && autoLogin) {
      Message.success("尝试自动登录中...");
    }
  }, [autoLogin]);

  const [form] = Form.useForm();

  const userCenterUrl = getUrlFromEnvConfig("userCenterUrl");
  const [username, setUsername] = useLocalStorageState<string | undefined>(
    "username",
    {
      defaultValue: "",
    }
  );

  useEffect(() => {
    setUsername("8G4E6P6EL67n");
  }, []);

  // 更新用户名
  const updateUsername = createSelectors(useUserStore).use.updateUsername();
  // 更新登录token
  const updateLoginToken = createSelectors(useUserStore).use.updateLoginToken();

  // 提交中
  const [
    submiting,
    { setTrue: setSubmitingTrue, setFalse: setSubmitingFalse },
  ] = useBoolean(false);

  // 校验表单
  const onValidate = async () => {
    try {
      await form.validate();
    } catch (e) {
      console.log(`validate form error:`, e);
    }
  };

  // 尝试登录
  const tryLogin = (data: { username: string }) => {
    const { username } = data;
    setSubmitingTrue();

    // 登录
    Promise.all([AuthService.loginApi(username.trim()), checkUpdate()])
      .then((res) => {
        const [loginRes, updateInfo] = res;
        const hasUpdate = !isEmptyObject(updateInfo);

        // 存在更新的话
        if (hasUpdate) {
          setAutoLogin(false);
          setSubmitingFalse();
          return;
        }

        updateUsername(username);

        // 存储mqtt配置信息
        cacheStorage.setItem("mqttConfig", loginRes?.data);

        // 模拟注入loginToken
        updateLoginToken(
          "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbklkIjoiZGE2NjcwOWQtMWE5Ny00YTdjLWE2ZjMtODBmMTAzODQzMGQ4IiwidXNlcklkIjoyMDF9.Py33dSxntdWdM9wy84xGxQHv-tZ1wpVdHl7t-TYs3I6NXXUG-4ANRq7gOFMnSRVsRrvkFX_iFlEequgZeZ4RWQ"
        );

        // 登录成功后，下次可以自动登录
        if (remember) {
          setAutoLoginEnable(true);
        }

        // 跳转到首页
        setTimeout(() => {
          navigate("/");
        }, 200);
      })
      .catch(() => {
        setSubmitingFalse();
      });
  };

  // 通过校验提交
  const onSubmit = (values: any) => {
    console.log("finish", values);
    if (!values.agreement) {
      Message.error("请先阅读并同意协议");
      return;
    }

    tryLogin(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onSubmit={onSubmit}
      initialValues={{
        username: remember ? username : "",
        agreement,
        remember,
      }}
    >
      <Form.Item<FieldType>
        label="子账号"
        field="username"
        requiredSymbol={false}
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input data-lpignore="true" />
      </Form.Item>

      <Form.Item noStyle field="agreement">
        <Checkbox
          defaultChecked={agreement}
          onChange={(checked) => {
            cacheStorage.setItem("agreement", checked);
          }}
        >
          我已阅读并同意
        </Checkbox>
      </Form.Item>

      <Form.Item<FieldType> noStyle field="remember">
        <Checkbox
          defaultChecked={remember}
          onChange={(checked) => {
            cacheStorage.setItem("remember", checked);
          }}
        >
          保持登录
        </Checkbox>
      </Form.Item>

      <Form.Item
        style={{
          marginTop: "20px",
        }}
      >
        <Button
          type="primary"
          long
          htmlType="submit"
          loading={submiting}
          onClick={onValidate}
        >
          登录
        </Button>
      </Form.Item>
      <>
        <a href={userCenterUrl} target="_blank">
          用户管理中心
        </a>
      </>
    </Form>
  );
};

export default LoginForm;
