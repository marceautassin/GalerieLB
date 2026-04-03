# Agent Creation Complete! 🎉

## Agent Summary

- **Name:** Gabrielle
- **Type:** Expert Agent (avec sidecar)
- **Purpose:** Direction artistique pour le site de la Galerie Louis Barrand — transformer une implémentation fonctionnelle en expérience visuelle de prestige
- **Status:** Prêt pour installation

## File Locations

- **Agent Config:** `_bmad-output/bmb-creations/art-director/art-director.agent.yaml`
- **Sidecar:** `_bmad-output/bmb-creations/art-director/art-director-sidecar/instructions.md`

## Installation

Package ton agent dans un module standalone avec `module.yaml` contenant `unitary: true`.

### Structure cible

```
my-custom-stuff/
├── module.yaml                    # unitary: true
└── agents/
    └── art-director/
        ├── art-director.agent.yaml
        └── _memory/
            └── art-director-sidecar/
                └── instructions.md
```

### Quick Start

1. Crée un dossier module (ex: `custom/`)
2. Ajoute `module.yaml` avec `unitary: true`
3. Place l'agent dans `agents/art-director/`
4. Inclus le sidecar dans `_memory/art-director-sidecar/`
5. Installe via le BMAD installer

### Documentation

https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/modules/bmb-bmad-builder/custom-content-installation.md#standalone-content-agents-workflows-tasks-tools-templates-prompts
