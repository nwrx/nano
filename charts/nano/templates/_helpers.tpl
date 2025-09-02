{{/*
Expand the name of the chart.
*/}}
{{- define "nano.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "nano.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "nano.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "nano.labels" -}}
helm.sh/chart: {{ include "nano.chart" . }}
{{ include "nano.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Get image repository for a service
*/}}
{{- define "nano.image.repository" -}}
{{- if .image.repository }}
{{- .image.repository }}
{{- else if .Values.global.image.repository }}
{{- .Values.global.image.repository }}
{{- else }}
{{- "ghcr.io/nwrx/nano" }}
{{- end }}
{{- end }}

{{/*
Get image tag for a service
*/}}
{{- define "nano.image.tag" -}}
{{- if .image.tag }}
{{- .image.tag }}
{{- else if .Values.global.image.tag }}
{{- .Values.global.image.tag }}
{{- else }}
{{- "main" }}
{{- end }}
{{- end }}

{{/*
Get image pull policy for a service
*/}}
{{- define "nano.image.pullPolicy" -}}
{{- if .image.pullPolicy }}
{{- .image.pullPolicy }}
{{- else if .Values.global.image.pullPolicy }}
{{- .Values.global.image.pullPolicy }}
{{- else }}
{{- "IfNotPresent" }}
{{- end }}
{{- end }}
