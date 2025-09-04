{{/*
Expand the name of the api service.
*/}}
{{- define "nano.api.name" -}}
{{- default (print .Chart.Name "-api") .Values.api.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name for the api service.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.api.fullname" -}}
{{- if .Values.api.fullnameOverride }}
{{- .Values.api.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (print .Chart.Name "-api") .Values.api.nameOverride }}
{{- if contains .Chart.Name .Release.Name }}
{{- printf "%s-api" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Selector labels for api service
*/}}
{{- define "nano.api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use for api service
*/}}
{{- define "nano.api.serviceAccountName" -}}
{{- if .Values.api.serviceAccount.create }}
{{- default (include "nano.api.fullname" .) .Values.api.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.api.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the API secret
*/}}
{{- define "nano.api.secrets" -}}
{{- printf "%s-secret" (include "nano.fullname" .) }}
{{- end }}
