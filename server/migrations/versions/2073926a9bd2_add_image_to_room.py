"""add image to room

Revision ID: 2073926a9bd2
Revises: 3e9f51b089fc
Create Date: 2024-10-27 20:03:01.604136

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2073926a9bd2'
down_revision = '3e9f51b089fc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('rooms', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('rooms', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###
