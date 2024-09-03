import React, { useState, useContext, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import StoreContext from '../store/Context';

const Login = () => {
  const navigate = useNavigate();

  const { isAuthenticated, login } = useContext(StoreContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<any>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmitAuth = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.message
          ? err?.response?.data?.message
          : err.message,
        life: 30000,
      });
    }
  };

  return (
    <div className="pages-body login-page p-d-flex p-flex-column">
      <Toast ref={toast} />

      <div className="p-as-center p-mt-auto p-mb-auto">
        <div className="pages-panel card p-d-flex p-flex-column">
          <div className="pages-header p-px-3 p-py-1">
            <h2>LOGIN</h2>
          </div>

          <h4>Welcome</h4>

          <div className="pages-detail p-mb-6 p-px-6">
            Please use the form to sign in
          </div>

          <form onSubmit={onSubmitAuth}>
            <div className="input-panel p-d-flex p-flex-column p-px-3">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope" />
                </span>
                <span className="p-float-label">
                  <InputText
                    type="text"
                    id="inputgroup1"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                  />
                  <label htmlFor="inputgroup1">Email</label>
                </span>
              </div>

              <div className="p-inputgroup p-mt-3 p-mb-6">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock" />
                </span>
                <span className="p-float-label">
                  <InputText
                    type="password"
                    id="inputgroup2"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                  />
                  <label htmlFor="inputgroup2">Password</label>
                </span>
              </div>
            </div>

            <Button
              className="login-button p-mb-6 p-px-3"
              label="LOGIN"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
