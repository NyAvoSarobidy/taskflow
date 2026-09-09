# TaskFlow — Guide de Déploiement Production

## 📋 Prérequis

- Node.js 20+
- Compte [Vercel](https://vercel.com)
- Compte [Railway](https://railway.app)
- MongoDB Atlas (déjà configuré)
- [Resend](https://resend.com) configuré
- [Stripe](https://stripe.com) configuré

---

## 1. Backend — Railway

### Installation CLI Railway

```bash
npm i -g @railway/cli
railway login
```

### Initialiser le projet

```bash
cd taskflow/apps/api
railway init
railway link
```

### Variables d'environnement

```bash
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.lcpacid.mongodb.net/taskflow"
railway variables set JWT_ACCESS_SECRET="$(openssl rand -hex 32)"
railway variables set JWT_REFRESH_SECRET="$(openssl rand -hex 32)"
railway variables set CLIENT_URL="https://taskflow-app.vercel.app"
railway variables set RESEND_API_KEY="re_xxxxx"
railway variables set STRIPE_SECRET_KEY="sk_live_xxxxx"
railway variables set STRIPE_PRICE_ID_FREE="price_xxxxx"
railway variables set STRIPE_PRICE_ID_PRO="price_xxxxx"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

### Déployer

```bash
railway up
```

### Récupérer l'URL

```bash
railway domain
# Exemple: https://taskflow-api.up.railway.app
```

---

## 2. Frontend — Vercel

### Installation CLI Vercel

```bash
npm i -g vercel
```

### Variables d'environnement sur Vercel

Dans le dashboard Vercel → Settings → Environment Variables :

```
NEXT_PUBLIC_API_URL=https://taskflow-api.up.railway.app
```

### Déployer

```bash
cd taskflow
vercel
# Suivre les instructions (choisir apps/web comme root directory)
```

---

## 3. Stripe Webhook (production)

1. Va sur [stripe.com/dashboard/webhooks](https://dashboard.stripe.com/webhooks)
2. Clique sur **Add endpoint**
3. URL : `https://taskflow-api.up.railway.app/api/billing/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clique sur **Add endpoint**
6. Copie le **Signing secret** (commence par `whsec_`)

### Ajouter le secret à Railway

```bash
railway variables set STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

---

## 4. Resend (production)

1. Va sur [resend.com/domains](https://resend.com/domains)
2. Ajoute ton domaine (ex: `taskflow.com`)
3. Configure les enregistrements DNS (SPF, DKIM, DMARC)
4. Vérifie le domaine
5. Met à jour `apps/api/src/services/emailService.ts` :
   ```typescript
   from: "TaskFlow <noreply@taskflow.com>"
   ```

---

## 5. MongoDB Atlas (production)

1. Va sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Network Access → Add IP Address
3. Clique sur **Allow Access from Anywhere** (0.0.0.0/0)
4. Attends 1-2 minutes que ça se propage

---

## 6. Vérification

### Health check

```bash
curl https://taskflow-api.up.railway.app/api/health
# Doit retourner: {"status":"ok","timestamp":"..."}
```

### Frontend

1. Ouvre `https://taskflow-app.vercel.app`
2. Teste l'inscription
3. Vérifie que tout fonctionne

---

## 7. Commandes utiles

### Voir les logs Railway

```bash
railway logs
```

### Re déployer

```bash
# Backend
cd apps/api && railway up

# Frontend
vercel --prod
```

### Générer des secrets JWT

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 8. Checklist avant mise en prod

- [ ] Backend déployé et health check OK
- [ ] Frontend déployé et accessible
- [ ] CORS configuré avec la bonne URL Vercel
- [ ] Stripe webhook configuré avec le bon URL
- [ ] Resend domaine vérifié
- [ ] MongoDB Atlas IP whitelist configuré
- [ ] Toutes les variables d'environnement sont définies
- [ ] Les JWT secrets sont générés et sécurisés
