{{/*
Expand the name of the app service.
*/}}
{{- define "nano.app.name" -}}
{{- default (print .Chart.Name "-app") .Values.app.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name for the app service.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.app.fullname" -}}
{{- if .Values.app.fullnameOverride }}
{{- .Values.app.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (print .Chart.Name "-app") .Values.app.nameOverride }}
{{- if contains .Chart.Name .Release.Name }}
{{- printf "%s-app" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Selector labels for app service
*/}}
{{- define "nano.app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use for app service
*/}}
{{- define "nano.app.serviceAccountName" -}}
{{- if .Values.app.serviceAccount.create }}
{{- default (include "nano.app.fullname" .) .Values.app.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.app.serviceAccount.name }}
{{- end }}
{{- end }}
