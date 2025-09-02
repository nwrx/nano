{{/*
Expand the name of the runners service.
*/}}
{{- define "nano.runners.name" -}}
{{- default (print .Chart.Name "-runners") .Values.runners.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name for the runners service.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.runners.fullname" -}}
{{- if .Values.runners.fullnameOverride }}
{{- .Values.runners.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default (print .Chart.Name "-runners") .Values.runners.nameOverride }}
{{- if contains .Chart.Name .Release.Name }}
{{- printf "%s-runners" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Selector labels for runners service
*/}}
{{- define "nano.runners.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.runners.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use for runners service
*/}}
{{- define "nano.runners.serviceAccountName" -}}
{{- if .Values.runners.serviceAccount.create }}
{{- default (include "nano.runners.fullname" .) .Values.runners.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.runners.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret to use for runners service
*/}}
{{- define "nano.runners.secrets" -}}
{{- if .Values.config.runners.secretRef }}
{{- .Values.config.runners.secretRef }}
{{- else }}
{{- printf "%s-secrets" (include "nano.runners.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Generate the list of initial runner URLs for auto-registration
*/}}
{{- define "nano.runners.initialServers" -}}
{{- if and .Values.runners.enabled .Values.config.runners.autoRegister -}}
{{- $fullname := include "nano.runners.fullname" . -}}
{{- $namespace := .Release.Namespace -}}
{{- $port := 8080 -}}
{{- $replicas := .Values.runners.replicas -}}
{{- $token := .Values.config.runners.token -}}
{{- $urls := list -}}
{{- range $i := until (int $replicas) -}}
  {{- $url := printf "http://%s@%s-%d.%s-headless.%s.svc.cluster.local:%d" $token $fullname $i $fullname $namespace $port -}}
  {{- $urls = append $urls $url -}}
{{- end -}}
{{- join "," $urls -}}
{{- end -}}
{{- end }}
