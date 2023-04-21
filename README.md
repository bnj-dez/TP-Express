# TP-Express

Dans le docker-compose.yml, il peut être nécessaire de changer cette ligne

volumes:
- ./MONGODATA:/data/db:rw

par

volumes:
- ${PWD}/MONGODATA:/data/db:rw


Créer un .env a partir de .env.example, et changer les 2 lignes suivantes pour les adapter.

MONGOOSE_STRING = 'mongodb://username:password@localhost:27017/sb_name?authSource=admin'

SECRET = 'UNE_CLE_SECRETE_A_CHANGER'