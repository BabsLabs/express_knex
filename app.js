 /*jshint esversion: 6 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Publications';

app.get('/', (req, res) => res.send('Hello Publications!'));

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// Get all papers from DB
app.get('/api/v1/papers', (req, res) => {
  database('papers').select()
  .then((papers) => {
    res.status(200).json(papers);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
});

// Get all footnotes from DB
app.get('/api/v1/footnotes', (req, res) => {
  database('footnotes').select()
  .then((footnotes) => {
    res.status(200).json(footnotes);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
});

// Post to papers
app.post('/api/v1/papers', (request, response) => {
  const paper = request.body;

  for (let requiredParameter of ['title', 'author']) {
    if (!paper[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('papers').insert(paper, 'id')
    .then(paper => {
      response.status(201).json({ id: paper[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// Post to footnotes
app.post('/api/v1/footnotes', (request, response) => {
  const footnote = request.body;

  for (let requiredParameter of ['note', 'paper_id']) {
    if (!footnote[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { note: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('footnotes').insert(footnote, 'id')
    .then(footnote => {
      response.status(201).json({ id: footnote[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// GET a single paper
app.get('/api/v1/papers/:id', (req, res) => {
  database('papers').where('id', req.params.id).select()
    .then(papers => {
      if (papers.length) {
        res.status(200).json(papers);
      } else {
        res.status(404).json({
          error: `Could not find paper with id ${req.params.id}`
        });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

// GET a single papers footnotes
app.get('/api/v1/papers/:id/footnotes', (req, res) => {
  database('footnotes').where('paper_id', req.params.id).select()
    .then(footnotes => {
      if (footnotes.length) {
        res.status(200).json(footnotes);
      } else {
        res.status(404).json({
          error: `Could not find paper with id ${req.params.id}`
        });
      }
    })
    .catch(error => {
      res.status(500).json({error});
    });
});
