# Project Template

Copy this HTML block to `content/projects.md` to add a new project card.

---

## Single Project Card

```html
<div class="project-card">
  <h3><a href="https://github.com/arthur-bryan/PROJECT_NAME" target="_blank" rel="noopener noreferrer">Project Name</a></h3>
  <p>Brief description of the project. What it does and why it's useful. Keep it to 2-3 sentences maximum.</p>
  <div class="tech-stack">
    <span class="tech-badge">Python</span>
    <span class="tech-badge">AWS</span>
    <span class="tech-badge">Terraform</span>
  </div>
</div>
```

---

## Project Card with Image

```html
<div class="project-card">
  <img src="https://placehold.co/800x400/1a1a1a/22d3ee?text=Project+Screenshot" alt="Project Screenshot" style="width:100%; border-radius:6px; margin-bottom:1rem;">
  <h3><a href="https://github.com/arthur-bryan/PROJECT_NAME" target="_blank" rel="noopener noreferrer">Project Name</a></h3>
  <p>Brief description of the project. What it does and why it's useful.</p>
  <div class="tech-stack">
    <span class="tech-badge">Python</span>
    <span class="tech-badge">Docker</span>
    <span class="tech-badge">Linux</span>
  </div>
</div>
```

---

## Available Tech Badges

Copy these as needed:

```html
<!-- Cloud -->
<span class="tech-badge">AWS</span>
<span class="tech-badge">Azure</span>
<span class="tech-badge">GCP</span>

<!-- IaC -->
<span class="tech-badge">Terraform</span>
<span class="tech-badge">Ansible</span>
<span class="tech-badge">CloudFormation</span>

<!-- Languages -->
<span class="tech-badge">Python</span>
<span class="tech-badge">Bash</span>
<span class="tech-badge">Go</span>
<span class="tech-badge">C</span>

<!-- Tools -->
<span class="tech-badge">Docker</span>
<span class="tech-badge">Kubernetes</span>
<span class="tech-badge">Git</span>
<span class="tech-badge">Linux</span>

<!-- AWS Services -->
<span class="tech-badge">Lambda</span>
<span class="tech-badge">EC2</span>
<span class="tech-badge">S3</span>
<span class="tech-badge">DynamoDB</span>
<span class="tech-badge">API Gateway</span>

<!-- Other -->
<span class="tech-badge">Flask</span>
<span class="tech-badge">FastAPI</span>
<span class="tech-badge">PostgreSQL</span>
<span class="tech-badge">Redis</span>
<span class="tech-badge">IoT</span>
<span class="tech-badge">Networking</span>
<span class="tech-badge">Security</span>
```

---

## Placeholder Images

Replace with your own images or use these placeholders:

```
https://placehold.co/800x400/1a1a1a/22d3ee?text=Your+Text+Here
https://placehold.co/600x300/1a1a1a/22d3ee?text=Screenshot
https://placehold.co/400x200/1a1a1a/22d3ee?text=Diagram
```

Colors match the theme:
- Background: `1a1a1a` (dark gray)
- Text: `22d3ee` (cyan accent)
