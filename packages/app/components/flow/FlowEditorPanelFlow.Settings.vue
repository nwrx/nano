<template>
  <FlowEditorPanelSection
    classContent="space-y-md"
    title="HTTP"
    text="Define the behavior of the HTTP trigger.">

    <div>
      <InputText
        placeholder="https://example.com/schema/input.json"
        classGroup="input-sm bg-editor-panel-data"
      />
      <InputText
        :modelValue="`${CONSTANTS.appHost}/john-doe/sfdc-lead-automation/unsightly-mango`"
        classGroup="input-sm bg-editor-panel-data"
      />
    </div>
    <FlowEditorPanelDataContainer>
      <FlowEditorPanelData
        name="Enabled"
        :modelValue="false"
      />
      <FlowEditorPanelSectionInputSwitch
        label="Override Variables"
        hint="Allow the user to override the variables via HTTP Headers."
      />
      <FlowEditorPanelSectionInputSwitch
        label="Override Secrets"
        hint="Allow the user to override the secrets via HTTP Headers."
      />
    </FlowEditorPanelDataContainer>
  </FlowEditorPanelSection>
</template>
