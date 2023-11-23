from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher_suite = Fernet(key)

with open('users.json', 'r') as file:
    user_data = file.read()

cipher_text = cipher_suite.encrypt(user_data.encode())


with open('encrypted_users.json', 'wb') as file:
    file.write(cipher_text)

print(key)
