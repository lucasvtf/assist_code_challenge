import { useContext, useState } from 'react';
import { registerOrLogin } from '../utils/api';
import { UserContext } from '../context/UserContext';

function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')
  const { setLoggedInUsername, setId } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLoginOrRegister === 'register' ? 'register' : 'login'
      const user = await registerOrLogin(url, username, password);
      setLoggedInUsername(user.username);
      setId(user.id);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form
        className='w-64 mx-auto mb-12'
        onSubmit={onSubmit}
      >
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
          className='block w-full rounded-sm p-2 mb-2 border'
        />
        <input
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='password'
          className='block w-full rounded-sm p-2 mb-2 border'
        />
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className='text-center mt-2'>
          {
            isLoginOrRegister === 'register' && (
              <div>
                Already a member?
                <button onClick={() => setIsLoginOrRegister('login')}>
                  Login here
                </button>
              </div>
            )}
          {
            isLoginOrRegister === 'login' && (
              <div>
                Don't have an account?
                <button onClick={() => setIsLoginOrRegister('register')}>
                  Register
                </button>
              </div>
            )}

        </div>
      </form>
    </div>
  );
}

export default RegisterAndLoginForm;
