#!/usr/bin/env bash
# Terminology gate.
#
# This archive holds no garment manufacturing templates, apparel cutting files or
# tailoring molds. The vocabulary below must not appear anywhere except in the policy
# documents that define the prohibition.
#
# See CONTRIBUTING.md → "Terminology constraint (non-negotiable)".

set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 1

PROHIBITED='\b(sewing pattern|apparel pattern|patternmaking|pattern block|cutting file|patrón de costura|patron de costura|molde de costura|molde de corte)\b'

# Documents allowed to quote the prohibited terms because they define the policy.
POLICY_DOCS=(
  ':(exclude)CONTRIBUTING.md'
  ':(exclude)README.md'
  ':(exclude)docs/nomenclature.md'
  ':(exclude).github/PULL_REQUEST_TEMPLATE.md'
  ':(exclude).github/ISSUE_TEMPLATE/*'
  ':(exclude)scripts/check-terminology.sh'
)

if matches=$(git grep -nIiE "$PROHIBITED" -- . "${POLICY_DOCS[@]}"); then
  echo "$matches"
  echo "::error::Prohibited garment-construction terminology found. Use 'surface design', 'repeat', 'motif', 'colourway' or 'tile' instead."
  exit 1
fi

echo "✔ No prohibited terminology found."
