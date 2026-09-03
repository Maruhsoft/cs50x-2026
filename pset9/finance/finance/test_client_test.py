from app import app, db

def run_test():
    with app.test_client() as client:
        # attempt to register a user
        resp = client.post('/register', data={
            'username': 'testuser',
            'password': 'secret',
            'confirmation': 'secret'
        }, follow_redirects=False)
        print('REGISTER status:', resp.status_code)
        print('REGISTER location/header:', resp.headers.get('Location'))

        # attempt to login the user
        resp2 = client.post('/login', data={
            'username': 'testuser',
            'password': 'secret'
        }, follow_redirects=False)
        print('LOGIN status:', resp2.status_code)
        print('LOGIN data snippet:', resp2.get_data(as_text=True)[:200])

if __name__ == '__main__':
    run_test()
