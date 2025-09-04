{{/*
Expand the name of the db service.
*/}}
{{- define "nano.database.name" -}}
{{- default (print .Chart.Name "-db") .Values.database.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name for the db service.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.database.fullname" -}}
{{- if .Values.database.fullnameOverride }}
{{- .Values.database.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (print .Chart.Name "-database") .Values.database.nameOverride }}
{{- if contains .Chart.Name .Release.Name }}
{{- printf "%s-database" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Selector labels for db service
*/}}
{{- define "nano.database.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.database.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use for db service
*/}}
{{- define "nano.database.serviceAccountName" -}}
{{- if .Values.database.serviceAccount.create }}
{{- default (include "nano.database.fullname" .) .Values.database.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.database.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the database secret
*/}}
{{- define "nano.database.secrets" -}}
{{- printf "%s-database" (include "nano.fullname" .) }}
{{- end }}

{{/*
Get the database host - internal service if database is enabled, external host if disabled
*/}}
{{- define "nano.database.host" -}}
{{- if .Values.database.enabled }}
{{- include "nano.database.fullname" . }}
{{- else }}
{{- .Values.config.database.host }}
{{- end }}
{{- end }}

{{/*
Get the database port - internal service port if database is enabled, external port if disabled
*/}}
{{- define "nano.database.port" -}}
{{- if .Values.database.enabled }}
{{- .Values.database.service.port }}
{{- else }}
{{- .Values.config.database.port }}
{{- end }}
{{- end }}
