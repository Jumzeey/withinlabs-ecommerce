server.use((req, res, next) => {
  if (req.method === "GET") {
    const db = router.db.getState();
    res.setHeader("X-Total-Count", db.products.length);
  }
  next();
});
