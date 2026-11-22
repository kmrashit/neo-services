
# Minimal Codebase Exploration Policy

## Core principle
Use the minimum context and minimum number of files
required to complete the user's request.

## File Exploration Rules

1. Do not scan or analyze the entire codebase by default.
2. Do not explore unrelated files for simple questions or changes.
3. If the user explicitly mentions a file, start with that file.
4. Read only directly relevant files required to understand
   the requested change.
5. Do not recursively explore folders unless necessary.
6. Do not search for all references or dependencies unless
   the task requires it.
7. Do not inspect package files, configurations, or
   architectural documents unless relevant.
8. Avoid reading generated files, build output, dependencies,
   logs, and unrelated documentation.

## Progressive Exploration

Follow this sequence:

1. Understand the user's request.
2. Identify the likely relevant file(s).
3. Inspect only those files.
4. Expand exploration only if a genuine dependency
   or missing context is discovered.
5. Stop exploring once sufficient context is available.

## Task-Based Exploration

- Simple question: Answer using existing context.
- Single-file change: Focus on the specified file.
- Bug fix: Inspect the affected code and necessary dependencies.
- Feature implementation: Explore relevant architecture
  and integration points.
- Refactoring: Explore affected modules and their dependencies.
- Cross-module changes: Explore all files necessary for correctness.

## Important

Do not read additional files just to gain more context.
Do not perform broad repository analysis as a default step.
Do not sacrifice correctness, but avoid unnecessary exploration.

Prioritize focused execution over exhaustive discovery.
