{{/*
Expand the name of the storage service.
*/}}
{{- define "nano.storage.name" -}}
{{- default (print .Chart.Name "-storage") .Values.storage.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name for the storage service.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.storage.fullname" -}}
{{- if .Values.storage.fullnameOverride }}
{{- .Values.storage.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (print .Chart.Name "-storage") .Values.storage.nameOverride }}
{{- if contains .Chart.Name .Release.Name }}
{{- printf "%s-storage" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Selector labels for storage service
*/}}
{{- define "nano.storage.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.storage.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use for storage service
*/}}
{{- define "nano.storage.serviceAccountName" -}}
{{- if .Values.storage.serviceAccount.create }}
{{- default (include "nano.storage.fullname" .) .Values.storage.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.storage.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the storage secret
*/}}
{{- define "nano.storage.secrets" -}}
{{- printf "%s-storage" (include "nano.fullname" .) }}
{{- end }}

{{/*
Storage pool configuration - uses internal MinIO if enabled, otherwise external configuration
*/}}
{{- define "nano.storage.poolConfiguration" -}}
{{- if .Values.storage.enabled -}}
{{- $config := dict -}}
{{- $_ := set $config "endpoint" (printf "http://%s.%s.svc.cluster.local:%d" (include "nano.storage.fullname" .) .Release.Namespace (.Values.storage.service.port | int)) -}}
{{- $_ := set $config "accessKeyId" .Values.config.storage.publicPoolConfiguration.accessKeyId -}}
{{- $_ := set $config "secretAccessKey" .Values.config.storage.publicPoolConfiguration.secretAccessKey -}}
{{- $_ := set $config "bucket" (.Values.config.storage.publicPoolConfiguration.bucket | default "default") -}}
{{- if .Values.config.storage.publicPoolConfiguration.region -}}
{{- $_ := set $config "region" .Values.config.storage.publicPoolConfiguration.region -}}
{{- end -}}
{{- $config | toJson -}}
{{- else -}}
{{- .Values.config.storage.publicPoolConfiguration | toJson -}}
{{- end -}}
{{- end -}}
