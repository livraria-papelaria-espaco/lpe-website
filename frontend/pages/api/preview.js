export default (req, res) => {
  if (process.env.PREVIEW_SECRET && req.query.secret !== process.env.PREVIEW_SECRET)
    return res.status(401).json({ message: 'Invalid token' });

  res.setPreviewData({});

  res.writeHead(307, { Location: '/' });
  return res.end();
};
